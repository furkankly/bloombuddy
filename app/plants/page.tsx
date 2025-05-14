"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchPlants } from "../query/fetchPlants";
import { createPlant } from "../query/createPlant";
import { updatePlant } from "../query/updatePlant";
import { deletePlant } from "../query/deletePlant";
import { useRouter } from "next/navigation";

const plantSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  weeklyWaterNeed: z
    .number({ invalid_type_error: "Must be a number" })
    .positive("Must be a positive number"),
  expectedHumidity: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
});

export type Plant = z.infer<typeof plantSchema>;

export interface PlantsResponse {
  data?: { plants: Plant[] };
  errors?: string[];
}

export default function PlantManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);

  const createForm = useForm<Plant>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: "",
      weeklyWaterNeed: 0,
      expectedHumidity: 0,
    },
  });

  const editForm = useForm<Plant>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: "",
      weeklyWaterNeed: 0,
      expectedHumidity: 0,
    },
  });

  const {
    data: plants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: fetchPlants,
  });

  const createPlantMutation = useMutation({
    mutationFn: createPlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      setAddDialogOpen(false);
      createForm.reset();
      toast.success("Plant added", {
        description: "Your plant has been added to the collection.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error adding plant", {
        description: error.message,
      });
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: ({ data }: { data: Plant }) => updatePlant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      setEditDialogOpen(false);
      setCurrentPlant(null);
      toast.success("Plant updated", {
        description: "Your plant has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error updating plant", {
        description: error.message,
      });
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: deletePlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      toast.success("Plant deleted", {
        description: "Your plant has been removed from the collection.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error deleting plant", {
        description: error.message,
      });
    },
  });

  const handleAddPlant = (data: Plant) => {
    createPlantMutation.mutate(data);
  };

  const handleEditPlant = (data: Plant) => {
    if (currentPlant) {
      updatePlantMutation.mutate({ data });
    }
  };

  const handleDeletePlant = (name: string) => {
    deletePlantMutation.mutate(name);
  };

  const startEdit = (plant: Plant) => {
    setCurrentPlant(plant);
    editForm.reset({
      name: plant.name,
      weeklyWaterNeed: plant.weeklyWaterNeed,
      expectedHumidity: plant.expectedHumidity,
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-300">
            Your Plant Collection
          </h1>
          <p className="text-gray-300 mt-2">
            BloomBuddy is here with you to make your plants thrive
          </p>
        </div>

        {/* Add Plant Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-300 hover:bg-purple-700 hover:cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Add Plant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Plant</DialogTitle>
              <DialogDescription>
                Enter the details of your new plant.
              </DialogDescription>
            </DialogHeader>

            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleAddPlant)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Plant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Monstera, Snake Plant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="weeklyWaterNeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Water Need (liters)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1.5"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="expectedHumidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Relative Humidity (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="e.g., 60"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddDialogOpen(false);
                      createForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-300 hover:bg-purple-700 hover:cursor-pointer"
                    disabled={createPlantMutation.isPending}
                  >
                    {createPlantMutation.isPending ? "Adding..." : "Add Plant"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Plant Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plant</DialogTitle>
            <DialogDescription>
              Update the details of your plant.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditPlant)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of Plant</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="weeklyWaterNeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Water Need (liters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="expectedHumidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Relative Humidity (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setCurrentPlant(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={updatePlantMutation.isPending}
                >
                  {updatePlantMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Plants List */}
      <Card>
        <CardHeader>
          <CardTitle>Manage your plant collection</CardTitle>
          <CardDescription>
            Keep track of your plants and their care requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading plants...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">
              <p>
                There was an error loading your plants. Please try again later.
              </p>
            </div>
          ) : plants.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <p>
                No plants added yet. Click the &quot;Add Plant&quot; button to
                get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name of Plant</TableHead>
                  <TableHead>Weekly Water Need (mm)</TableHead>
                  <TableHead>Expected Humidity (%)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plants.map((plant) => (
                  <TableRow
                    key={plant.name}
                    className="hover:cursor-pointer"
                    onClick={() => {
                      router.push(`/plants/${plant.name}`);
                    }}
                  >
                    <TableCell className="font-medium">{plant.name}</TableCell>
                    <TableCell>{plant.weeklyWaterNeed.toFixed(1)}</TableCell>
                    <TableCell>{plant.expectedHumidity}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="hover:cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(plant);
                          }}
                          disabled={updatePlantMutation.isPending}
                        >
                          <Pencil className="h-4 w-4 text-green-600" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          className="hover:cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlant(plant.name);
                          }}
                          disabled={deletePlantMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
