import { useShallow } from "zustand/shallow";
import useLoading from "../hooks/use-loading";

const GlobalLoader = () => {
  const [
    isLoading,
    message
  ] = useLoading(useShallow(state => [
    state.isLoading,
    state.message
  ]));

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      {message && <div className="mt-4 text-white text-lg">{message}</div>}
    </div>
  )
}

export default GlobalLoader