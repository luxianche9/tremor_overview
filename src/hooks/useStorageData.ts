"use client"

import { Agent } from "@/data/agents/schema"
import { agents as defaultAgents } from "@/data/agents/agents"
import { Ticket } from "@/data/support/schema"
import { tickets as defaultTickets } from "@/data/support/tickets"
import {
  getStorageData,
  initializeStorage,
  setStorageData,
} from "@/lib/storage"
import { useEffect, useState } from "react"

/**
 * Hook for managing agents data with sessionStorage persistence
 */
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data from sessionStorage or defaults
  useEffect(() => {
    const initialData = initializeStorage("AGENTS", defaultAgents)
    setAgents(initialData)
    setIsLoading(false)
  }, [])

  // Update specific agent
  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents((prev) => {
      const updated = prev.map((agent) =>
        agent.agent_id === agentId ? { ...agent, ...updates } : agent,
      )
      setStorageData("AGENTS", updated)
      return updated
    })
  }

  // Create new agent
  const createAgent = (agent: Agent) => {
    setAgents((prev) => {
      const updated = [...prev, agent]
      setStorageData("AGENTS", updated)
      return updated
    })
  }

  // Delete agent
  const deleteAgent = (agentId: string) => {
    setAgents((prev) => {
      const updated = prev.filter((agent) => agent.agent_id !== agentId)
      setStorageData("AGENTS", updated)
      return updated
    })
  }

  // Reset to default data
  const resetAgents = () => {
    setAgents(defaultAgents)
    setStorageData("AGENTS", defaultAgents)
  }

  return {
    agents,
    isLoading,
    updateAgent,
    createAgent,
    deleteAgent,
    resetAgents,
  }
}

/**
 * Hook for managing tickets data with sessionStorage persistence
 */
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data from sessionStorage or defaults
  useEffect(() => {
    const initialData = initializeStorage("TICKETS", defaultTickets)
    setTickets(initialData)
    setIsLoading(false)
  }, [])

  // Update specific ticket
  const updateTicket = (
    ticketId: string,
    updates: Partial<Ticket>,
  ) => {
    setTickets((prev) => {
      const updated = prev.map((ticket, index) => {
        // Use index or another unique identifier if available
        const id = `${ticket.policyNumber}-${ticket.created}`
        return id === ticketId ? { ...ticket, ...updates } : ticket
      })
      setStorageData("TICKETS", updated)
      return updated
    })
  }

  // Create new ticket
  const createTicket = (ticket: Ticket) => {
    setTickets((prev) => {
      const updated = [ticket, ...prev] // Add new ticket at the beginning
      setStorageData("TICKETS", updated)
      return updated
    })
  }

  // Delete ticket
  const deleteTicket = (ticketId: string) => {
    setTickets((prev) => {
      const updated = prev.filter((ticket) => {
        const id = `${ticket.policyNumber}-${ticket.created}`
        return id !== ticketId
      })
      setStorageData("TICKETS", updated)
      return updated
    })
  }

  // Reset to default data
  const resetTickets = () => {
    setTickets(defaultTickets)
    setStorageData("TICKETS", defaultTickets)
  }

  return {
    tickets,
    isLoading,
    updateTicket,
    createTicket,
    deleteTicket,
    resetTickets,
  }
}
