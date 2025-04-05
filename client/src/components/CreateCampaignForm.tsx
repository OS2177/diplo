
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  type: z.enum(["Personal", "Social", "Local", "Global", "Ecological"]),
  locations: z.array(z.object({
    summary: z.string().min(3, "Location must be at least 3 characters")
  })),
  endDate: z.date().min(new Date(), "End date must be in the future"),
  sponsor: z.string().min(3, "Sponsor name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCampaignForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      type: "Local",
      locations: [{ summary: "" }],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sponsor: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "locations"
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const now = new Date();
      const endDate = new Date(data.endDate);
      if (endDate <= now) {
        throw new Error("End date must be in the future.");
      }

      const newCampaign = {
        id: Date.now().toString(),
        title: data.title.trim(),
        summary: data.summary.trim(),
        type: data.type,
        status: user ? "live" : "pending",
        creator_id: user?.id,
        countdown: "5 days",
        locations: data.locations.map(loc => loc.summary.trim()),
        sponsor: data.sponsor.trim(),
        image: uploadedImage
      };
      console.log("Campaign data:", newCampaign);

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully and is pending review.",
      });

      form.reset();
      setUploadedImage(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create campaign. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-heading font-bold mb-4">Create New Campaign</h2>
      <p className="text-neutral-600 mb-6">
        Fill in the details below to create a new voting campaign. Make sure to provide clear and accurate information.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Input placeholder="Campaign summary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="Ecological">Ecological</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Locations</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`locations.${index}.summary`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g. Paris, France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ summary: "" })}
            >
              + Add Another Location
            </Button>
          </div>

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sponsor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sponsor</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sponsor organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="block mb-2">Campaign Image</FormLabel>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center">
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Campaign preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 text-neutral-700 hover:text-neutral-900"
                    onClick={() => setUploadedImage(null)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="text-neutral-500">
                      <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                      <p>Click to upload an image</p>
                      <p className="text-xs mt-1">PNG, JPG or WEBP (max 2MB)</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default CreateCampaignForm;
