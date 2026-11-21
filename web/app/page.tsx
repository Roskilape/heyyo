import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'
export default function Home() {
  return (
    <div className="flex justify-center items-center bg-blue-800 flex-1">
      <p className="text-4xl">Welcome World</p>
      <Show when="signed-out">
        <SignInButton mode='modal' />

      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
