"use client";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { use, useState, useTransition } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GearIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { updateCalorieGoalAction, updateUserNameAction } from "@/data/services/cookies";

interface SettingsModalProps {
  calorieGoalPromise: Promise<number>;
  id: string;
  admin?: boolean;
}

export default function SettingsModal({ calorieGoalPromise, id, admin = false }: SettingsModalProps) {
  const [userName, setUserName] = useState(id);
  const [caloriesGoal, setCaloriesGoal] = useState<string>(use(calorieGoalPromise).toString());
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Store initial values for comparison
  const initialUserName = id;
  const initialCaloriesGoal = use(calorieGoalPromise);

  const handleSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any values have changed
    const hasUserNameChanged = userName !== initialUserName;
    const hasCaloriesGoalChanged = parseInt(caloriesGoal) !== initialCaloriesGoal;

    // If nothing changed, close modal and return early
    if (!hasUserNameChanged && !hasCaloriesGoalChanged) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      try {
        // Only update what has changed
        if (hasCaloriesGoalChanged) {
          await updateCalorieGoalAction(parseInt(caloriesGoal));
        }
        if (hasUserNameChanged && admin) {
          await updateUserNameAction(userName);
        }
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to update settings:", error);
      }
    });
  };

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="link"
            size="sm"
          >
            <GearIcon className="mr-2 h-4 w-4 text-base" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSettings}
            className="space-y-4"
          >
            <Input
              min={1000}
              type="number"
              value={caloriesGoal}
              onChange={(e) => setCaloriesGoal(e.target.value)}
              placeholder="Calorie goals"
              required
            />
            <Input
              disabled={!admin}
              maxLength={20}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              required
            />
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update"}
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
          variant="link"
          size="sm"
        >
          <GearIcon className="mr-2 h-4 w-4 text-base" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DialogTitle className="text-base">Update</DialogTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSettings}
          className="space-y-4 px-4"
        >
          <Input
            type="number"
            className="text-base"
            value={caloriesGoal}
            onChange={(e) => setCaloriesGoal(e.target.value)}
            placeholder="Calorie goals"
            required
          />
          <Input
            disabled={!admin}
            className="text-base"
            maxLength={20}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            required
          />
          <Button
            className="w-full text-base"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update"}
          </Button>
        </form>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="text-base"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
