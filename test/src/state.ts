import { useZState } from "@acoboyz/react-zstate";

export const useTestState = (queryKey?: string) => useZState<string>('global', queryKey);
