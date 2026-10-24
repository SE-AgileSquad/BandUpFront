import MainLayout from "@/components/MainLayout"

const LandingPage = () => {

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-4xl font-bold">Welcome to MyApp</h1>
        <p className="text-lg text-gray-600">Your one-stop solution for managing your tasks efficiently.</p>
      </div>
    </MainLayout>
  )
}

export default LandingPage