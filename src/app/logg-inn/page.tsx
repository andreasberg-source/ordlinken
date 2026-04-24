import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Logg inn — OrdLinken' };

export default function LoggInnPage() {
  return (
    <main className="mx-auto mt-16 w-full max-w-sm px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Logg inn</h1>
      <LoginForm />
    </main>
  );
}
