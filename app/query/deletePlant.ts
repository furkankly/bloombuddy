export async function deletePlant(name: string) {
  const response = await fetch(`/api/plants/${name}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.errors?.join(", ") || "Failed to delete plant");
  }
}
