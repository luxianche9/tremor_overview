"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { Divider } from "@/components/Divider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { TicketDrawer } from "@/components/ui/TicketDrawer"
import {
  categoryTypes,
  policyTypes,
  priorities,
  statusOptions,
  ticketTypes,
} from "@/data/support/schema"
import { useTickets } from "@/hooks/useStorageData"
import { cx } from "@/lib/utils"
import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileCopyLine,
} from "@remixicon/react"
import { useParams, useRouter } from "next/navigation"
import React from "react"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = decodeURIComponent(params.ticketId as string)

  const { tickets, updateTicket, deleteTicket, isLoading } = useTickets()
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const ticket = React.useMemo(
    () =>
      tickets.find((t) => {
        const id = `${t.policyNumber}-${t.created}`
        return id === ticketId
      }),
    [tickets, ticketId],
  )

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDelete = () => {
    deleteTicket(ticketId)
    router.push("/support")
  }

  const handleStatusChange = (newStatus: string) => {
    updateTicket(ticketId, { status: newStatus })
  }

  if (isLoading) {
    return (
      <main>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading ticket details...</p>
        </div>
      </main>
    )
  }

  if (!ticket) {
    return (
      <main>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Ticket Not Found
          </h1>
          <p className="mt-2 text-gray-500">
            The ticket you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button className="mt-4" onClick={() => router.push("/support")}>
            <RiArrowLeftLine className="size-4" />
            Back to Support
          </Button>
        </div>
      </main>
    )
  }

  const statusVariant = {
    resolved: "success" as const,
    "in-progress": "warning" as const,
    escalated: "error" as const,
  }[ticket.status]

  const priorityColor = {
    low: "bg-emerald-600 dark:bg-emerald-400",
    medium: "bg-gray-500 dark:bg-gray-500",
    high: "bg-orange-500 dark:bg-orange-500",
    emergency: "bg-red-500 dark:bg-red-500",
  }[ticket.priority]

  const categoryInfo = categoryTypes.find((c) => c.value === ticket.category)
  const policyInfo = policyTypes.find((p) => p.value === ticket.policyType)
  const ticketTypeInfo = ticketTypes.find((t) => t.value === ticket.type)
  const priorityInfo = priorities.find((p) => p.value === ticket.priority)

  return (
    <main>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/support")}
            className="mt-1"
          >
            <RiArrowLeftLine className="size-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                Ticket Details
              </h1>
              <Badge variant={statusVariant} className="capitalize">
                {ticket.status.replace("-", " ")}
              </Badge>
            </div>
            <p className="mt-1 text-gray-500 sm:text-sm/6 dark:text-gray-500">
              Policy #{ticket.policyNumber}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            <RiEditLine className="size-4" />
            Edit
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <RiDeleteBinLine className="size-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Ticket</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this ticket? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Divider />

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Overview
            </h3>
            <Divider className="my-4" />

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Policy Number
                </dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="font-mono font-medium text-gray-900 dark:text-gray-50">
                    {ticket.policyNumber}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(ticket.policyNumber, "policyNumber")
                    }
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <RiFileCopyLine
                      className={cx(
                        "size-4",
                        copiedField === "policyNumber" && "text-emerald-600",
                      )}
                    />
                  </button>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Policy Type
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-50">
                  {policyInfo?.name || ticket.policyType}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-50">
                  {categoryInfo?.name || ticket.category}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Type
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-50">
                  {ticketTypeInfo?.name || ticket.type}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Priority
                </dt>
                <dd className="mt-1">
                  <Badge variant="neutral" className="gap-1.5 font-normal">
                    <span
                      className={cx("size-2 shrink-0 rounded-sm", priorityColor)}
                      aria-hidden="true"
                    />
                    <span className="capitalize">{ticket.priority}</span>
                  </Badge>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Duration
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-50">
                  {ticket.duration
                    ? `${ticket.duration} minutes`
                    : "Not specified"}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created At
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-50">
                  {new Date(ticket.created).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Description Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Description
            </h3>
            <Divider className="my-4" />
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {ticket.description || "No description provided."}
            </p>
          </Card>
        </div>

        {/* Right Column - Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Quick Actions
            </h3>
            <Divider className="my-4" />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Update Status
                </label>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="capitalize">
                          {status.replace("-", " ")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Additional Info
            </h3>
            <Divider className="my-4" />

            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Category Description
                </dt>
                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {categoryInfo?.description || "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Priority SLA
                </dt>
                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {priorityInfo?.sla || "N/A"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Policy Coverage
                </dt>
                <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {policyInfo?.description || "N/A"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      {/* Edit Drawer */}
      <TicketDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdateTicket={updateTicket}
        editTicket={ticket}
        mode="edit"
      />
    </main>
  )
}
