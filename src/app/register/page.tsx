import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Registrer deg — OrdLinken' };

export default function RegisterPage() {
  return (
    <main className="mx-auto mt-16 w-full max-w-sm px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Opprett konto</h1>
      <RegisterForm />
    </main>
  );
}
