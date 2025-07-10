import SigninForm from '../../app/components/auth/signin';

export default function SigninPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <SigninForm />
      </div>
    </main>
  );
}
