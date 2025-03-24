import { Spinner } from '@chakra-ui/react'

const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Spinner size="lg" color="primary" />
      <div className="loader">Chargement en cours...</div>
    </div>
  )
}

export default Loader
