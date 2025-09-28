"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
 
import { Search, ArrowUp, ArrowDown, Command, X, Users, MessageSquare, BarChart3, Settings, Plus, FileText, Calendar, Bell, Mail, Phone, Globe, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface SearchItem {
  id: string
  title: string
  description: string
  type: 'contact' | 'page'
}

interface ActionItem {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  shortcut?: string
  category: 'search' | 'action' | 'navigation'
  action: () => void
}

interface ActionCenterProps {
  isOpen: boolean
  onClose: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function ActionCenter({ isOpen, onClose, searchValue, onSearchChange }: ActionCenterProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  // Local query state so typing here doesn't affect the header search bar
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  
  const [latestSearches] = useState([
    { id: '1', title: 'Omar Sattam', description: 'Contact profile', type: 'contact' },
    { id: '2', title: 'Campaigns', description: 'View all campaigns', type: 'page' },
    { id: '3', title: 'Settings', description: 'Configure app settings', type: 'page' }
  ])

  const quickActions: ActionItem[] = [
    {
      id: 'create-contact',
      title: 'Create new contact',
      description: 'Add a new contact to your list',
      icon: <Plus className="h-4 w-4" />,
      shortcut: '⌘N',
      category: 'action',
      action: () => navigate('/contacts/create')
    },
    {
      id: 'create-campaign',
      title: 'Create new campaign',
      description: 'Start a new marketing campaign',
      icon: <MessageSquare className="h-4 w-4" />,
      shortcut: '⌘K',
      category: 'action',
      action: () => navigate('/campaigns/create')
    },
    {
      id: 'view-analytics',
      title: 'View analytics',
      description: 'Check your performance metrics',
      icon: <BarChart3 className="h-4 w-4" />,
      shortcut: '⌘A',
      category: 'navigation',
      action: () => navigate('/analytics')
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your preferences',
      icon: <Settings className="h-4 w-4" />,
      shortcut: '⌘,',
      category: 'navigation',
      action: () => navigate('/settings')
    }
  ]

  const allActions = [...quickActions]

  // Filter contacts based on query
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(query.toLowerCase()) ||
    contact.phone.includes(query)
  )

  // Filter actions based on query
  const filteredActions = allActions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.description?.toLowerCase().includes(query.toLowerCase())
  )

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    const totalItems = query.length === 0 
      ? latestSearches.length + quickActions.length
      : filteredContacts.length + filteredActions.length

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      // Handle enter key press based on current selection
      if (query.length === 0) {
        if (selectedIndex < latestSearches.length) {
          const item = latestSearches[selectedIndex]
          if (item.type === 'contact') {
            navigate(`/contacts/${item.id}`)
          } else {
            navigate(`/${item.title.toLowerCase()}`)
          }
          onClose()
        } else {
          const actionIndex = selectedIndex - latestSearches.length
          if (actionIndex < quickActions.length) {
            quickActions[actionIndex].action()
            onClose()
          }
        }
      } else {
        if (selectedIndex < filteredContacts.length) {
          navigate(`/contacts/${filteredContacts[selectedIndex].id}`)
          onClose()
        } else {
          const actionIndex = selectedIndex - filteredContacts.length
          if (actionIndex < filteredActions.length) {
            filteredActions[actionIndex].action()
            onClose()
          }
        }
      }
    }
  }

  // Content component to be used in both Sheet and Dialog
  const ActionCenterContent = () => {
    return (
      <>
        {/* 1. Searchbar with p-4 and bottom border */}
        <div className="p-4 border-b border-border/50 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter a command or type / to view all commands"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-3 h-10 text-sm bg-background border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* 2. Results Area with flex-1 to take up remaining space */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30 hover:scrollbar-thumb-border/50"
          >
            {/* Show latest searches when no query */}
            {query.length === 0 && (
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Search className="h-3 w-3" />
                    Latest searches
                  </h3>
                  <div className="space-y-1">
                    {latestSearches.map((item, index) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                          selectedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}
                        onClick={() => {
                          if (item.type === 'contact') {
                            navigate(`/contacts/${item.id}`)
                            onClose()
                          } else {
                            navigate(`/${item.title.toLowerCase()}`)
                            onClose()
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {item.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Zap className="h-3 w-3" />
                    Quick actions
                  </h3>
                  <div className="space-y-1">
                    {quickActions.map((action, index) => (
                      <div
                        key={action.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                          selectedIndex === latestSearches.length + index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}
                        onClick={() => {
                          action.action()
                          onClose()
                        }}
                      >
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{action.title}</div>
                          {action.description && (
                            <div className="text-xs text-muted-foreground truncate">{action.description}</div>
                          )}
                        </div>
                        {action.shortcut && !isMobile && (
                          <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                            {action.shortcut}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Show search results when there's a query */}
            {query.length > 0 && (
              <div className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={query}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Contacts Results */}
                    {filteredContacts.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          Contacts ({filteredContacts.length})
                        </h3>
                        <div className="space-y-1">
                          {filteredContacts.slice(0, 3).map((contact, index) => (
                            <div
                              key={contact.id}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                                selectedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                              )}
                              onClick={() => {
                                navigate(`/contacts/${contact.id}`)
                                onClose()
                              }}
                            >
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{contact.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{contact.phone}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Results */}
                    {filteredActions.length > 0 && (
                      <div>
                        <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Command className="h-3 w-3" />
                          Actions ({filteredActions.length})
                        </h3>
                        <div className="space-y-1">
                          {filteredActions.slice(0, 5).map((action, index) => (
                            <div
                              key={action.id}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                                selectedIndex === filteredContacts.length + index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                              )}
                              onClick={() => {
                                action.action()
                                onClose()
                              }}
                            >
                              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                {action.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{action.title}</div>
                                {action.description && (
                                  <div className="text-xs text-muted-foreground truncate">{action.description}</div>
                                )}
                              </div>
                              {action.shortcut && !isMobile && (
                                <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                  {action.shortcut}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No results */}
                    {filteredContacts.length === 0 && filteredActions.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">No results found</p>
                        <p className="text-xs text-muted-foreground">Try a different search term</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* 3. Footer with shortcuts - only show on desktop */}
        {!isMobile && (
          <div className="flex items-center justify-between p-3 border-t border-border/30 bg-muted/30 text-xs text-muted-foreground flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span>Move up/down</span>
              </div>
              <div className="flex items-center gap-1">
                <span>/</span>
                <span>Command guide</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span>Close</span>
              <Button
                variant="secondary"
                size="sm"
                className="h-6 px-2 text-xs font-medium hover:bg-secondary/80"
                onClick={onClose}
              >
                ESC
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Render Sheet on mobile, Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[80vh] p-0 gap-0 flex flex-col"
        >
          <ActionCenterContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-xl p-0 gap-0 overflow-hidden h-[600px] flex flex-col" 
        showCloseButton={false}
      >
        <ActionCenterContent />
      </DialogContent>
    </Dialog>
  )
}