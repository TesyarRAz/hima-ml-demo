import './App.css'
import RenderRouter from './core/routes/render.route'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useSyncQueryLoading } from './hooks/use-sync-query-loader'

function App() {
  useSyncQueryLoading()

  return (
    <>
      <RenderRouter />
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
