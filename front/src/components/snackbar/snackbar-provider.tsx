// SnackbarProvider is no longer needed - react-hot-toast handles notifications
// This component is kept for backward compatibility but just renders children

type Props = {
  children: React.ReactNode;
};

export default function SnackbarProvider({ children }: Props) {
  return <>{children}</>;
}
