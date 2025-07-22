interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}
