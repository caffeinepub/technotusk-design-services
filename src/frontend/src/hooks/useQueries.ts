import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectType } from "../backend.d";
import { useActor } from "./useActor";

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      email,
      projectType,
      message,
    }: {
      id: string;
      name: string;
      email: string;
      projectType: ProjectType;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.submitInquiry(id, name, email, projectType, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiryCount"] });
    },
  });
}
