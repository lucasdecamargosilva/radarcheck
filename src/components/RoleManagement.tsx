import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserCog, Shield, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserWithRoles {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

const AVAILABLE_ROLES = ["admin", "user"] as const;

export const RoleManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string;
    role: string;
  }>({ open: false, userId: "", role: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_all_users_with_roles");
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ 
          user_id: userId, 
          role: role as "admin" | "user" 
        }]);

      if (error) throw error;

      toast({
        title: "Função adicionada",
        description: `Função "${role}" adicionada com sucesso.`,
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast({
        title: "Erro ao adicionar função",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as "admin" | "user");

      if (error) throw error;

      toast({
        title: "Função removida",
        description: `Função "${role}" removida com sucesso.`,
      });

      await loadUsers();
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast({
        title: "Erro ao remover função",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setDeleteDialog({ open: false, userId: "", role: "" });
    }
  };

  if (loading) {
    return (
      <Card className="shadow-strong">
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando usuários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-strong">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Gerenciamento de Funções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.user_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-muted/30 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {user.full_name || "Sem nome"}
                      </h4>
                      {user.roles.includes("admin") && (
                        <Shield className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cadastrado em: {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={role === "admin" ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {role}
                            <button
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  userId: user.user_id,
                                  role,
                                })
                              }
                              disabled={actionLoading === `${user.user_id}-${role}`}
                              className="ml-1 hover:text-destructive transition-colors"
                            >
                              {actionLoading === `${user.user_id}-${role}` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Nenhuma função
                        </Badge>
                      )}
                    </div>

                    <Select
                      onValueChange={(role) => handleAddRole(user.user_id, role)}
                      disabled={!!actionLoading}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Adicionar função" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ROLES.filter((role) => !user.roles.includes(role)).map(
                          (role) => (
                            <SelectItem key={role} value={role} className="text-xs">
                              <div className="flex items-center gap-2">
                                <Plus className="h-3 w-3" />
                                {role}
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover função</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a função "{deleteDialog.role}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemoveRole(deleteDialog.userId, deleteDialog.role)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
