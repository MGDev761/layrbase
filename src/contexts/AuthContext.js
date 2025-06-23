import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms} ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Get user profile
  const getUserProfile = async (userId) => {
    try {
      const profilePromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await withTimeout(profilePromise, 15000);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  // Get user organizations
  const getUserOrganizations = async () => {
    try {
      const rpcPromise = supabase.rpc('get_user_organizations');
      const { data, error } = await withTimeout(rpcPromise, 15000);

      if (error) {
        console.error('Error calling get_user_organizations RPC:', error);
        
        // Fallback: direct query if RPC function doesn't exist
        console.log('Trying fallback query for user organizations...');
        const fallbackPromise = supabase
          .from('user_organizations')
          .select(`
            organization_id,
            role,
            is_active,
            organizations (
              id,
              name,
              slug
            )
          `)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('is_active', true);
        
        const { data: fallbackData, error: fallbackError } = await withTimeout(fallbackPromise, 15000);

        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return [];
        }

        // Transform fallback data to match expected format
        return fallbackData.map(item => ({
          organization_id: item.organization_id,
          organization_name: item.organizations?.name,
          organization_slug: item.organizations?.slug,
          role: item.role,
          is_active: item.is_active
        }));
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user organizations:', error);
      throw error;
    }
  };

  // Sign up
  const signUp = async ({ email, password, firstName, lastName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Immediately set user and fetch profile/organizations
      if (data.user) {
        setUser(data.user);
        
        try {
          const profile = await getUserProfile(data.user.id);
          setUserProfile(profile);
          
          const userOrgs = await getUserOrganizations();
          setOrganizations(userOrgs);
          
          if (userOrgs && userOrgs.length > 0) {
            setCurrentOrganization(userOrgs[0]);
          }
        } catch (profileError) {
          console.error('Error fetching user data after sign in:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setOrganizations([]);
      setCurrentOrganization(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Create organization
  const createOrganization = async (organizationData) => {
    try {
      console.log('Creating organization with data:', organizationData);
      
      // Use the database function to create organization and add user as owner
      const rpcPromise = supabase.rpc('create_organization_with_owner', {
        org_name: organizationData.name,
        org_slug: organizationData.slug,
        org_description: organizationData.description,
        org_industry: organizationData.industry,
        org_website: organizationData.website
      });
      
      const { data, error } = await withTimeout(rpcPromise, 8000);

      console.log('RPC call result:', { data, error });

      if (error) {
        console.error('Database error creating organization:', error);
        
        if (error.message.includes('function') || error.message.includes('does not exist') || error.message.includes('timed out')) {
          console.log('RPC function failed or timed out, trying manual approach...');
          return await createOrganizationManual(organizationData);
        }
        
        throw error;
      }

      console.log('Organization created successfully:', data);

      // Refresh organizations
      const userOrgs = await getUserOrganizations();
      setOrganizations(userOrgs);
      
      // Set the new organization as current
      if (data && data.length > 0) {
        const newOrg = data[0];
        setCurrentOrganization({
          organization_id: newOrg.organization_id,
          organization_name: newOrg.organization_name,
          organization_slug: newOrg.organization_slug,
          role: newOrg.role
        });
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error('Error creating organization:', error);
      return { data: null, error };
    }
  };

  // Manual organization creation fallback
  const createOrganizationManual = async (organizationData) => {
    try {
      console.log('Creating organization manually...');
      
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{
          name: organizationData.name,
          slug: organizationData.slug,
          description: organizationData.description,
          industry: organizationData.industry,
          website: organizationData.website
        }])
        .select()
        .single();

      console.log('Organization insert result:', { org, orgError });

      if (orgError) {
        console.error('Error inserting organization:', orgError);
        throw orgError;
      }

      // Add user as owner
      const { error: userOrgError } = await supabase
        .from('user_organizations')
        .insert([{
          user_id: user.id,
          organization_id: org.id,
          role: 'owner',
        }]);

      console.log('User organization insert result:', { userOrgError });

      if (userOrgError) {
        console.error('Error inserting user organization:', userOrgError);
        throw userOrgError;
      }

      // Refresh organizations
      const userOrgs = await getUserOrganizations();
      setOrganizations(userOrgs);
      
      // Set the new organization as current
      setCurrentOrganization({
        organization_id: org.id,
        organization_name: org.name,
        organization_slug: org.slug,
        role: 'owner'
      });

      return { data: org, error: null };
    } catch (error) {
      console.error('Error in manual organization creation:', error);
      return { data: null, error };
    }
  };

  // Join organization
  const joinOrganization = async (invitationToken) => {
    try {
      // Get invitation details
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('organization_invitations')
        .select('*')
        .eq('token', invitationToken)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString());

      if (invitationsError) throw invitationsError;
      if (!invitationsData || invitationsData.length === 0) {
        return { data: null, error: new Error('Invitation not found or has expired') };
      }

      // Add user to organization
      const { error: userOrgError } = await supabase
        .from('user_organizations')
        .insert([{
          user_id: user.id,
          organization_id: invitationsData[0].organization_id,
          role: invitationsData[0].role,
        }]);

      if (userOrgError) throw userOrgError;

      // Mark invitation as accepted
      const { error: updateError } = await supabase
        .from('organization_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitationsData[0].id);

      if (updateError) throw updateError;

      // Refresh organizations
      const userOrgs = await getUserOrganizations();
      setOrganizations(userOrgs);

      return { data: invitationsData[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Refresh organizations
  const refreshOrganizations = async () => {
    try {
      const userOrgs = await getUserOrganizations();
      setOrganizations(userOrgs);
      
      // Update current organization if it's no longer in the list
      if (currentOrganization && !userOrgs.find(org => org.organization_id === currentOrganization.organization_id)) {
        if (userOrgs.length > 0) {
          setCurrentOrganization(userOrgs[0]);
        } else {
          setCurrentOrganization(null);
        }
      }
      
      return userOrgs;
    } catch (error) {
      console.error('Error refreshing organizations:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Check permissions
  const hasPermission = async (organizationId, requiredRole) => {
    try {
      const { data, error } = await supabase
        .rpc('has_permission', {
          org_id: organizationId,
          required_role: requiredRole,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthError(null);
        console.log('Initializing auth...');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('User found:', session.user.email);
          setUser(session.user);
          
          const profile = await getUserProfile(session.user.id);
          setUserProfile(profile);
          console.log('User profile loaded');
          
          const userOrgs = await getUserOrganizations();
          setOrganizations(userOrgs);
          console.log('User organizations loaded');
          
          if (userOrgs && userOrgs.length > 0) {
            setCurrentOrganization(userOrgs[0]);
            console.log('Set current organization');
          }
        } else {
          console.log('No user session found');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setAuthError(error);
      } finally {
        console.log('Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      // Cleanup code if needed
    };
  }, []);

  const value = {
    user,
    userProfile,
    organizations,
    currentOrganization,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    createOrganization,
    joinOrganization,
    updateUserProfile,
    hasPermission,
    setCurrentOrganization,
    refreshOrganizations,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 