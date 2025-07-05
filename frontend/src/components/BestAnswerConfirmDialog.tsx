import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BestAnswerConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answerUserName: string;
}

export function BestAnswerConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  answerUserName,
}: BestAnswerConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ベストアンサーに選択</AlertDialogTitle>
          <AlertDialogDescription>
            {answerUserName}さんの回答をベストアンサーに選択しますか？
            <br />
            ベストアンサーは後から変更することができます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            ベストアンサーに選択
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
