import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClientCard from "@/components/clients/ClientCard";
import AddClientDialog from "@/components/clients/AddClientDialog";
import AddProjectDialog from "@/components/clients/AddProjectDialog";
import { Client, Project } from "@/types/entities";

const STORAGE_KEY = "devmanage_clients_v1";

const Clients = () => {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [openAddClient, setOpenAddClient] = useState(false);
  const [projectModal, setProjectModal] = useState<{ open: boolean; client?: Client }>({ open: false });

  // Load + persist to localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Client[];
        setClients(parsed);
      } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (client: Client) => setClients((prev) => [client, ...prev]);

  const addProject = (project: Project) => {
    setClients((prev) =>
      prev.map((client) => (client.id === project.clientId ? { ...client, projects: [project, ...(client.projects || [])] } : client))
    );
  };

  const filtered = useMemo(() => {
    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) return clients;
    return clients.filter((client) =>
      [client.name, client.company, client.email]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(searchQuery))
    );
  }, [clients, query]);

  return (
    <section>
      <Helmet>
        <title>DevManage – Clients</title>
        <meta name="description" content="Manage your clients and projects in DevManage." />
        <link rel="canonical" href="/clients" />
      </Helmet>

      <header className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage your client relationships and contact information</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients by name, email, or company..."
            className="w-full sm:w-[340px]"
            aria-label="Search clients"
          />
          <Button onClick={() => setOpenAddClient(true)}>+ Add Client</Button>
        </div>
      </header>

      <main>
        {filtered.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">No clients yet. Add your first client to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((client) => (
              <ClientCard key={client.id} client={client} onAddProject={(selectedClient) => setProjectModal({ open: true, client: selectedClient })} />
            ))}
          </div>
        )}
      </main>

      <AddClientDialog open={openAddClient} onOpenChange={setOpenAddClient} onAdd={addClient} />

      {projectModal.client && (
        <AddProjectDialog
          open={projectModal.open}
          onOpenChange={(open) => setProjectModal((previousState) => ({ ...previousState, open }))}
          clientId={projectModal.client!.id}
          clientName={projectModal.client!.name}
          onAdd={addProject}
        />
      )}
    </section>
  );
};

export default Clients;

