"use client"

import { useNavigationContext } from "@/hooks/use-navigation-context"
import { motion, AnimatePresence } from "framer-motion"
import { pageWrapperLoadingVariants, skeletonStaggerVariants, skeletonItemVariants } from "@/lib/transitions"
import { CardSkeleton } from "@/components/ui/card"

interface PageWrapperProps {
  children: React.ReactNode
  isLoading?: boolean
}

export function PageWrapper({ children, isLoading: propIsLoading = false }: PageWrapperProps) {
  const { isLoading: contextIsLoading } = useNavigationContext()
  const isLoading = propIsLoading || contextIsLoading

  return (
    <motion.div 
      className="sidebar-content-transition h-full flex flex-col"
      variants={pageWrapperLoadingVariants}
      initial="initial"
      animate={isLoading ? "loading" : "loaded"}
    >
      <div className="sidebar-content-transition flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              className="space-y-4 p-6"
              variants={skeletonStaggerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div variants={skeletonItemVariants}>
                <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
              </motion.div>
              <motion.div variants={skeletonItemVariants}>
                <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
              </motion.div>
              <div className="space-y-2">
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                </motion.div>
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                </motion.div>
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </motion.div>
  )
}
