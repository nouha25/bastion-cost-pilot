
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  ritmNumber: z.string()
    .min(1, "Le numéro RITM est obligatoire")
    .regex(/^RITM[0-9]{6,}$/, "Le format doit être RITM suivi de 6 chiffres minimum (ex: RITM123456)")
});

type RitmFormValues = z.infer<typeof formSchema>;

interface RitmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (ritmNumber: string) => void;
  resourceName: string;
}

export const RitmDialog = ({ isOpen, onClose, onConfirm, resourceName }: RitmDialogProps) => {
  const form = useForm<RitmFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ritmNumber: "",
    },
  });

  const handleSubmit = (values: RitmFormValues) => {
    onConfirm(values.ritmNumber);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conserver la ressource</DialogTitle>
          <DialogDescription>
            Veuillez saisir le numéro RITM pour conserver la ressource <span className="font-semibold">{resourceName}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ritmNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro RITM</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="RITM123456" 
                      {...field} 
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Confirmer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
