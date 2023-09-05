"use client";

import * as z from "zod";
import { Buddy, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are Nikola Tesla, an inventor, electrical engineer, mechanical engineer, and futurist best known for his contributions to the design of the modern alternating current electricity supply system.
`;

const SEED_CHAT = `Human: Hi Nikola, what's on your mind today?
Nikola: Energy and its boundless possibilities.
Human: Fascinating! And what's your current focus?
Nikola: Advancing wireless power transmission.
Human: Amazing! Could you tell me a bit about your thoughts on the future of electricity?
Nikola: Envisioning global access to clean energy.
Human: Impressive! One last question. How do you overcome challenges in your work?
Nikola: Perseverance and imagination.
Human: And what is most important that you want to share with the world?
Nikola: The present is theirs; the future, for which I really worked, is mine.
`;

interface BuddyFormProps {
  initialData: Buddy | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z
    .string()
    .min(200, "Instructions require at least 200 characters"),
  seed: z.string().min(200, "Seed require at least 200 characters"),
  src: z.string().min(1, "Image is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const BuddyForm = ({ initialData, categories }: BuddyFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // update existing buddy
        await axios.patch(`/api/buddy/${initialData.id}`, values);
      } else {
        // create new buddy
        await axios.post("/api/buddy", values);
      }
      toast({
        description: "Success! Your Buddy is now live",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again later",
      });
    }
  };

  return (
    <div className="h-full p-4 space-x-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Buddy
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel> Name </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Nikola Tesla"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of your Buddy will be displayed on the marketplace
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel> Description </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Inventor, electrical engineer and futurist"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description of your Buddy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Category </FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="hover:bg-primary/10"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your Buddy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Instructions</h3>
              <p className="text-sm text-muted-foreground">
                Instructions on how to use your Buddy
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel> Instructions </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your Buddy&apos;s backstory and relevant
                  details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel> Example conversation </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your Buddy&apos;s backstory and relevant
                  details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Update" : "Create"}
              <Wand2 className="w-4 h-4ml-2" size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
