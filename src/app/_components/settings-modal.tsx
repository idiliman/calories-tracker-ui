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
import { Label } from "@/components/ui/label";

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

  // Check if any values have changed
  const hasUserNameChanged = userName !== initialUserName;
  const hasCaloriesGoalChanged = parseInt(caloriesGoal) !== initialCaloriesGoal;

  const handleSettings = async (e: React.FormEvent) => {
    e.preventDefault();

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
            <div className="grid items-center gap-1.5">
              <Label htmlFor="calorie">Calorie goals</Label>
              <Input
                id="calorie"
                min={1000}
                type="number"
                value={caloriesGoal}
                onChange={(e) => setCaloriesGoal(e.target.value)}
                placeholder="Calorie goals"
                required
              />
            </div>
            <div className="grid items-center gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                disabled={!admin}
                maxLength={20}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
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
      <DrawerContent>
        <DrawerHeader>
          <DialogTitle>Update</DialogTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSettings}
          className="space-y-4 px-4"
        >
          <div className="grid items-center gap-1.5">
            <Label
              htmlFor="calorie"
              className="text-base"
            >
              Calorie goals
            </Label>
            <Input
              className="text-base"
              id="calorie"
              min={1000}
              type="number"
              value={caloriesGoal}
              onChange={(e) => setCaloriesGoal(e.target.value)}
              placeholder="Calorie goals"
              required
            />
          </div>

          <div className="grid items-center gap-1.5">
            <Label
              htmlFor="username"
              className="text-base"
            >
              Username
            </Label>
            <Input
              className="text-base"
              id="username"
              disabled={!admin}
              maxLength={20}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
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
