import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  type: z.enum(["Local", "Regional", "Global"]),
  lat: z.string().transform(Number),
  long: z.string().transform(Number),
  radius: z.string().transform(Number),
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
      type: "Regional",
      lat: "",
      long: "",
      radius: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      sponsor: "",
    },
  });


  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Validate coordinates
      const lat = parseFloat(data.lat.toString());
      const long = parseFloat(data.long.toString());
      const radius = parseFloat(data.radius.toString());

      if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error("Invalid latitude. Must be between -90 and 90.");
      }

      if (isNaN(long) || long < -180 || long > 180) {
        throw new Error("Invalid longitude. Must be between -180 and 180.");
      }

      if (isNaN(radius) || radius <= 0) {
        throw new Error("Invalid radius. Must be greater than 0.");
      }

      // Validate dates
      const now = new Date();
      const endDate = new Date(data.endDate);
      if (endDate <= now) {
        throw new Error("End date must be in the future.");
      }

      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newCampaign = {
        id: Date.now().toString(),
        title: data.title.trim(),
        summary: data.summary.trim(),
        type: data.type,
        status: "pending",
        countdown: "5 days",
        lat,
        long,
        radius,
        endDate: data.endDate,
        sponsor: data.sponsor.trim(),
        image: uploadedImage
      };
      console.log("Campaign data:", newCampaign);

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully and is pending review.",
      });

      // Reset form
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
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="Latitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" placeholder="Longitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="radius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radius (km)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Impact radius in kilometers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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