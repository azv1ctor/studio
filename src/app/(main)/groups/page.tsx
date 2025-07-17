
import { PageHeader } from "@/components/page-header"
import { getGroups } from "@/lib/api"
import { GroupsClient } from "./groups-client"

export default async function GroupsPage() {
  const groups = await getGroups()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Grupos"
        description="Gerencie grupos de funcionários para permissões e organização."
      />
      <GroupsClient data={groups} />
    </div>
  )
}
