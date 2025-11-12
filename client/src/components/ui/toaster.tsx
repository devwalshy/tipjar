import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="fpgsjgs">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="r71n_j7">
            <div className="grid gap-1" data-oid="hivlv8m">
              {title && <ToastTitle data-oid=":3lgota">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="93dynqr">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="pj-_5wk" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="c4kmu5s" />
    </ToastProvider>
  );
}
