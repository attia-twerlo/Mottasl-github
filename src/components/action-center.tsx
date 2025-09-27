"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
 
import { Search, ArrowUp, ArrowDown, Command, X, Users, MessageSquare, BarChart3, Settings, Plus, FileText, Calendar, Bell, Mail, Phone, Globe, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { mockContacts } from '@/data/mock-data'
import { cn } from '@/lib/utils'

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
      description: 'Add a new contact to your database',
      icon: <Users className="h-4 w-4" />,
      shortcut: '⌘ A',
      category: 'action',
      action: () => {
        navigate('/contacts/create')
        onClose()
      }
    },
    {
      id: 'create-campaign',
      title: 'Create new campaign',
      description: 'Start a new messaging campaign',
      icon: <MessageSquare className="h-4 w-4" />,
      shortcut: '⌘ B',
      category: 'action',
      action: () => {
        navigate('/campaigns/create')
        onClose()
      }
    },
    {
      id: 'view-analytics',
      title: 'View analytics',
      description: 'Open analytics dashboard',
      icon: <BarChart3 className="h-4 w-4" />,
      shortcut: '⌘ C',
      category: 'navigation',
      action: () => {
        navigate('/analytics')
        onClose()
      }
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure application settings',
      icon: <Settings className="h-4 w-4" />,
      shortcut: '⌘ D',
      category: 'navigation',
      action: () => {
        navigate('/settings')
        onClose()
      }
    },
    {
      id: 'templates',
      title: 'Message templates',
      description: 'Manage message templates',
      icon: <FileText className="h-4 w-4" />,
      shortcut: '⌘ E',
      category: 'action',
      action: () => {
        navigate('/campaigns/templates')
        onClose()
      }
    },
    {
      id: 'campaigns',
      title: 'All campaigns',
      description: 'View and manage campaigns',
      icon: <MessageSquare className="h-4 w-4" />,
      shortcut: '⌘ F',
      category: 'navigation',
      action: () => {
        navigate('/campaigns')
        onClose()
      }
    }
  ]

  const allActions = [...quickActions]

  const filteredActions = query.trim()
    ? allActions.filter(action => {
        const searchTerm = query.toLowerCase()
        return action.title.toLowerCase().includes(searchTerm) ||
               (action.description?.toLowerCase() || '').includes(searchTerm) ||
               action.category.toLowerCase().includes(searchTerm)
      })
    : allActions

  const filteredSearches = query.trim()
    ? latestSearches.filter(search => {
        const searchTerm = query.toLowerCase()
        return search.title.toLowerCase().includes(searchTerm) ||
               search.description.toLowerCase().includes(searchTerm) ||
               search.type.toLowerCase().includes(searchTerm)
      })
    : latestSearches

  const displayedSearches = filteredSearches.slice(0, 3)

  // Contacts search (top 5)
  const filteredContacts = query.trim()
    ? mockContacts
        .filter(contact => {
          const searchTerm = query.toLowerCase()
          return contact.name.toLowerCase().includes(searchTerm) ||
                 contact.phone.toLowerCase().includes(searchTerm)
        })
        .slice(0, 5)
    : []

  // Hide contacts before searching
  const displayedContacts = query.trim() ? filteredContacts : []

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  // Reset local query when dialog opens
  useEffect(() => {
    if (isOpen) setQuery("")
  }, [isOpen])

  

  const scrollSelectedIntoView = (index: number) => {
    if (!contentRef.current || index < 0) return
    
    // Calculate total available items
    const searchCount = Math.min(3, filteredSearches.length)
    const totalItems = searchCount + filteredActions.length
    if (index >= totalItems) return

    // Find the selected item element
    const selectedElement = contentRef.current.querySelector(`[data-item-index="${index}"]`) as HTMLElement
    if (!selectedElement) return

    const container = contentRef.current
    const containerRect = container.getBoundingClientRect()
    const elementRect = selectedElement.getBoundingClientRect()

    // Check if element is above viewport
    if (elementRect.top < containerRect.top) {
      selectedElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
    // Check if element is below viewport
    else if (elementRect.bottom > containerRect.bottom) {
      selectedElement.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const searchesCount = Math.min(3, filteredSearches.length)
    const actionsCount = filteredActions.length
    const totalItems = searchesCount + actionsCount
    
    const getNextValidIndex = (currentIndex: number, isUp: boolean): number => {
      if (totalItems === 0) return -1;
      
      // If no index selected yet
      if (currentIndex < 0) {
        return isUp ? totalItems - 1 : 0;
      }
      
      // Simple circular navigation
      return isUp 
        ? (currentIndex - 1 + totalItems) % totalItems 
        : (currentIndex + 1) % totalItems;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = getNextValidIndex(prev, false)
          setTimeout(() => scrollSelectedIntoView(newIndex), 0)
          return newIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => {
          const newIndex = getNextValidIndex(prev, true)
          setTimeout(() => scrollSelectedIntoView(newIndex), 0)
          return newIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          // Get all items in order
          const allItems = [...displayedContacts, ...filteredSearches, ...filteredActions]
          const selectedItem = allItems[selectedIndex]

          if (!selectedItem) return

          // Handle contacts
          if ('phone' in selectedItem) {
            navigate(`/contacts/${selectedItem.id}`)
            onClose()
            return
          }

          // Handle latest searches
          if ('type' in selectedItem) {
            if (selectedItem.type === 'contact' && selectedItem.id === '1') {
              navigate('/contacts/6') // Omar Sattam
              onClose()
            } else if (selectedItem.type === 'page') {
              navigate(`/${selectedItem.title.toLowerCase()}`)
              onClose()
            }
            return
          }

          // Handle quick actions
          if (selectedItem.action) {
            selectedItem.action()
          }
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  const handleItemClick = (item: any, index: number) => {
    setSelectedIndex(index)
    
    // Handle contacts
    if ('phone' in item) {
      navigate(`/contacts/${item.id}`)
      onClose()
      return
    }

    // Handle latest searches
    if ('type' in item) {
      if (item.type === 'contact' && item.id === '1') {
        navigate('/contacts/6') // Omar Sattam
        onClose()
      } else if (item.type === 'page') {
        navigate(`/${item.title.toLowerCase()}`)
        onClose()
      }
      return
    }

    // Handle quick actions
    if (item.action) {
      item.action()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden h-[600px] flex flex-col" showCloseButton={false}>
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
              className="pl-9 pr-20 h-10 text-sm border-0 bg-transparent focus-visible:bg-transparent focus-visible:ring-0 shadow-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const allItems = [...filteredSearches, ...filteredActions]
                  if (allItems[selectedIndex]) {
                    if (selectedIndex < filteredSearches.length) {
                      // Handle search item
                      onSearchChange(allItems[selectedIndex].title)
                    } else {
                      // Handle action item
                      const actionItem = allItems[selectedIndex] as ActionItem
                      actionItem.action()
                    }
                  }
                }}
                className="h-6 px-2 text-xs font-medium hover:bg-secondary/80"
              >
                ENTER
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-muted/50"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Content with p-4 and overflow-auto */}
        <div ref={contentRef} className="p-4 flex-1 overflow-y-auto space-y-2">
          <AnimatePresence>
            {displayedContacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <h3 className="text-sm font-regular text-muted-foreground m-3">Contacts</h3>
                <div className="space-y-1">
                  {displayedContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      data-item-index={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedIndex === index ? "bg-muted" : "hover:bg-muted/100"
                      )}
                      onClick={() => handleItemClick(contact, index)}
                    >
                      <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phone}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {filteredSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <h3 className="text-sm font-regulat text-muted-foreground m-3">Latest searches</h3>
                <div className="space-y-1">
                  {filteredSearches.slice(0, 3).map((search, index) => (
                    <motion.div
                      key={search.id}
                      data-item-index={displayedContacts.length + index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedIndex === (displayedContacts.length + index) ? "bg-muted" : "hover:bg-muted/100"
                      )}
                      onClick={() => handleItemClick(search, displayedContacts.length + index)}
                    >
                      <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center border border-border/50">
                        <Search className="h-3.5 w-3.5" />
                      </div>
              <div className="flex-1">
                        <div className="text-sm font-medium">{search.title}</div>
                        <div className="text-xs text-muted-foreground">{search.description}</div>
                      </div>
                      
                    </motion.div>
                  ))}
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Separator */}
          {filteredSearches.length > 0 && filteredActions.length > 0 && (
            <div className="mx-3 my-2 border-t border-border/50"></div>
          )}

          <AnimatePresence>
            {filteredActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-sm font-regular text-muted-foreground m-3">Quick actions</h3>
                <div className="space-y-1">
                  {filteredActions.map((action, index) => {
                    const globalIndex = displayedContacts.length + Math.min(3, filteredSearches.length) + index
                    return (
                      <motion.div
                        key={action.id}
                        data-item-index={globalIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          selectedIndex === (Math.min(3, filteredSearches.length) + index) ? "bg-muted" : "hover:bg-muted/100"
                        )}
                        onClick={() => handleItemClick(action, globalIndex)}
                      >
                        <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center border border-border/50">
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                        {/* Removed shortcut badge in list as requested */}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(displayedContacts.length === 0) && filteredSearches.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* 3. Footer with p-4 */}
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground flex-shrink-0">
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
      </DialogContent>
    </Dialog>
  )
}


