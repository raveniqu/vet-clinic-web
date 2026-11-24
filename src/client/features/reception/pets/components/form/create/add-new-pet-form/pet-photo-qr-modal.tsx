import { QrCode, Smartphone, Sparkles } from "lucide-react";
import { usePetProfile } from "#/client/features/reception/pets/hooks/use-pet-profile";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/client/shared/shadcn/components/ui/dialog";

export function PetPhotoQrModal() {
  const { isQrModalOpen, setIsQrModalOpen, closeQrModal, handleSimulateMobileUpload } =
    usePetProfile();

  return (
    <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Smartphone className="size-5 text-primary" />
            <DialogTitle>ถ่ายภาพด้วยโทรศัพท์มือถือ</DialogTitle>
          </div>
          <DialogDescription>
            สแกนคิวอาร์โค้ดนี้ด้วยกล้องมือถือเพื่อถ่ายภาพสัตว์เลี้ยง
            ภาพที่ถ่ายจะปรากฏบนหน้าจอนี้โดยอัตโนมัติ
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-muted/50 p-6">
          <div className="relative flex size-44 items-center justify-center rounded-2xl bg-card p-3 shadow-inner">
            {/* SVG QR Code Illustration */}
            <svg
              className="size-full text-foreground"
              viewBox="0 0 100 100"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>ภาพประกอบคิวอาร์โค้ด</title>
              {/* Corner 1 */}
              <rect
                x="5"
                y="5"
                width="28"
                height="28"
                rx="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />
              {/* Corner 2 */}
              <rect
                x="67"
                y="5"
                width="28"
                height="28"
                rx="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />
              {/* Corner 3 */}
              <rect
                x="5"
                y="67"
                width="28"
                height="28"
                rx="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />
              {/* Dynamic QR Dots Pattern */}
              <rect x="42" y="10" width="8" height="8" rx="1" />
              <rect x="54" y="18" width="6" height="6" rx="1" />
              <rect x="42" y="30" width="8" height="8" rx="1" />
              <rect x="10" y="42" width="6" height="8" rx="1" />
              <rect x="22" y="42" width="8" height="6" rx="1" />
              <rect x="36" y="46" width="10" height="10" rx="2" />
              <rect x="52" y="42" width="8" height="8" rx="1" />
              <rect x="68" y="42" width="8" height="6" rx="1" />
              <rect x="82" y="42" width="8" height="10" rx="1" />
              <rect x="42" y="64" width="8" height="8" rx="1" />
              <rect x="56" y="60" width="10" height="6" rx="1" />
              <rect x="70" y="68" width="6" height="10" rx="1" />
              <rect x="84" y="68" width="8" height="8" rx="1" />
              <rect x="48" y="80" width="10" height="10" rx="1" />
              <rect x="72" y="84" width="10" height="8" rx="1" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <QrCode className="size-5" />
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            รหัสเซสชัน:{" "}
            <span className="font-mono font-medium text-foreground">PET-SESSION-8842</span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSimulateMobileUpload}
            className="w-full sm:w-auto"
          >
            <Sparkles className="mr-2 size-4 text-primary" />
            จำลองการอัปโหลดจากมือถือ (ตัวอย่าง)
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeQrModal}
            className="w-full sm:w-auto"
          >
            ยกเลิก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
