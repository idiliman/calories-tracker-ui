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
import { useRouter } from "next/navigation";
import { postIntake } from "@/data/services/ai";
import { useMediaQuery } from "@/hooks/use-media-query";

const placeholders = [
  "2 eggs, toast, and coffee (no sugar)",
  "Yesterday, grilled salmon and vegetables",
  "Chicken salad and 1 apple",
  "Greek yogurt with berries",
];

export default function AddMealsModal() {
  const [newMeal, setNewMeal] = useState("");
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const router = useRouter();

  const handleAddMeal = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      try {
        const res = await postIntake({ prompt: newMeal });
        if (res.status === 200) {
          setNewMeal("");
          setIsOpen(false);
          router.refresh();
        } else {
          console.error("Failed to add meal:", res.error);
        }
      } catch (error) {
        console.error("Failed to add meal:", error);
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
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Add a Meal</DrawerTitle>
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
            className="w-full"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Meal"}
          </Button>
        </form>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
