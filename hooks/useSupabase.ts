import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSupabaseClient } from "@/lib/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createClerkSupabaseClient(() => getToken()),
    [getToken]
  );

  return client;
}
