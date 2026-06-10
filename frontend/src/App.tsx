import { useAppStore } from '@/stores/appStore'
import { Header } from '@/components/layout/Header'
import { LandingPage } from '@/components/landing/LandingPage'
import { UploadScreen } from '@/components/upload/UploadScreen'
import { ProcessingScreen } from '@/components/upload/ProcessingScreen'
import { ResultsScreen } from '@/components/player/ResultsScreen'

function App() {
  const { screen } = useAppStore()

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return <LandingPage />
      case 'upload':
        return <UploadScreen />
      case 'processing':
        return <ProcessingScreen />
      case 'results':
        return <ResultsScreen />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <Header />
      <main>{renderScreen()}</main>
    </div>
  )
}

export default App
