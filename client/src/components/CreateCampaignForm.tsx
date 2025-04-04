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
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be less than 500 characters"),
  scope: z.enum(["Global", "Regional"]),
  region: z.string().optional(),
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
      description: "",
      scope: "Global",
      region: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
      sponsor: "",
    },
  });
  
  const selectedScope = form.watch("scope");
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would be an API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Campaign data:", data, "Image:", uploadedImage);
      
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      
      // Reset form
      form.reset();
      setUploadedImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of the campaign" 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Scope</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="Regional">Regional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedScope === "Regional" && (
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Americas">Americas</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="Africa">Africa</SelectItem>
                        <SelectItem value="Oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
