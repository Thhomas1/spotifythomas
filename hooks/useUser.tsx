import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react"; // remapeamos para evitar conflicos :D
import { User } from "@supabase/auth-helpers-nextjs";
import {Subscription, UserDetails} from "@/types"
import { createContext, useContext, useEffect, useState } from "react";


type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  // agarramos el usuario 
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null >(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // hook para cargar los detalles del usuario y para cargar la subscripcion
  // incluso lo podemos reutilizar y podemos verificar rapidamente si el usuario esta susususcribete

  // usamos Supabase para fetchear algo de la database

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase 
    .from('subscriptions')
    .select('*, prices(*, products(*))') // (*) lo usamos para elegir tutti de la data 
    .in('status', ['trialing', 'active'])
    .single();

    useEffect(() => { // si estamos logeados pero no estamos cargando los detalles del usuario y la scubscripcion 
        if (user && !isLoadingData && !userDetails && !subscription ) {
          setIsLoadingData(true);

          Promise.allSettled([getUserDetails(), getSubscription()]).then(
            (results) => {

              const userDetailsPromise = results[0];
              const subscriptionPromise = results[1];

              if (userDetailsPromise.status === "fulfilled") {
                setUserDetails(userDetailsPromise.value.data as UserDetails);
              }

              if (subscriptionPromise.status === "fulfilled") {
                setSubscription(subscriptionPromise.value.data as Subscription);
              }

              setIsLoadingData(false);
            }
          );
        } else if (!user && !isLoadingUser && !isLoadingData) {
          setUserDetails(null);
          setSubscription(null);
        }
    }, [user, isLoadingUser]);


    const value = {
      accessToken,
      user,
      userDetails,
      isLoading: isLoadingUser || isLoadingData,
      subscription
    };

    return <UserContext.Provider value={value} {...props} />

};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider') // asi vemos si existe un error mas alla del uso
  }

  return context;
} 

// thomy estuvo aqui :p