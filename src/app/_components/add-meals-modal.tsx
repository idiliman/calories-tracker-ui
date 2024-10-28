import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { postIntake } from "@/data/services/ai";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";

const placeholders = [
  "3 roti canai, teh tarik",
  "Yesterday, 1 set ayam gepuk, teh o ais",
  "2 eggs, toast, and coffee (no sugar)",
];

export default function AddMealsModal() {
  const [newMeal, setNewMeal] = useState("");
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleAddMeal = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      try {
        const res = await postIntake({ prompt: newMeal });
        if (res.status === 200) {
          router.refresh();
          setNewMeal("");
          setIsOpen(false);
        } else {
          console.log("Failed to add meal:", res.error);
        }
      } catch (error) {
        console.log("Failed to add meal:", error);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4 text-base" />
            Add Meal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Meal</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleAddMeal}
            className="space-y-4"
          >
            <Textarea
              className="min-h-[100px] text-base"
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
              placeholder={placeholder}
              required
              disabled={isPending}
            />
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Meal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4 text-base" />
          Add Meal
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-base">Add a Meal</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleAddMeal}
          className="space-y-4 px-4"
        >
          <Textarea
            className="min-h-[100px] text-base"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            placeholder={placeholder}
            required
            disabled={isPending}
          />
          <Button
            className="w-full text-base"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Meal"}
          </Button>
        </form>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="text-base"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
