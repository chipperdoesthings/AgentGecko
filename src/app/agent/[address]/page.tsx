import AgentDetailClient from "@/components/AgentDetailClient";
import { MOCK_AGENTS } from "@/lib/agents-seed";

export function generateStaticParams() {
  return MOCK_AGENTS.map((agent) => ({
    address: agent.address,
  }));
}

export default function AgentDetailPage() {
  return <AgentDetailClient />;
}
