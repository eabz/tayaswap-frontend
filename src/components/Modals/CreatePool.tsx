'use client'
import { TRANSITION_VARIANTS } from '@/constants'
import {
  Box,
  Center,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  HStack,
  IconButton,
  Text
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { CloseIcon } from '../Icons'

interface ICreatePoolModalProps {
  open: boolean
  close: () => void
  onClose: (token0: string | undefined, token1: string | undefined, newPool: string | undefined) => void
}

enum View {
  Pairs = 0,
  Liquidity = 1
}

export function CreatePoolsModal({ open, close, onClose }: ICreatePoolModalProps) {
  const [view, setView] = useState(View.Pairs)

  const [token0, setToken0] = useState<string | undefined>(undefined)
  const [token1, setToken1] = useState<string | undefined>(undefined)
  const [newPool, setNewPool] = useState<string | undefined>(undefined)

  return (
    <Box position="absolute" width={{ base: 'full', lg: 'calc(100vw - 600px)' }} px="5">
      <Center height="calc(100dvh - 400px)">
        <DialogRoot open={open} size="xs" motionPreset="scale" onExitComplete={() => onClose(token0, token1, newPool)}>
          <DialogBackdrop />
          <DialogContent rounded="25px" background="modal-background" border="1px solid" borderColor="modal-border">
            <DialogCloseTrigger />
            <DialogHeader>
              <HStack justifyContent="space-between">
                <HStack justifyContent="start" alignItems="center" gap="15px">
                  <DialogTitle>
                    <Text color="text-contrast" fontWeight="400">
                      {view === View.Pairs && 'Create Pool'}
                      {view === View.Liquidity && 'Add Initial Liquidity'}
                    </Text>
                  </DialogTitle>
                </HStack>
                <IconButton
                  onClick={close}
                  variant="ghost"
                  size="xs"
                  rounded="full"
                  _hover={{ background: 'button-group-button-background' }}
                  background="modal-selector-button-background"
                >
                  <CloseIcon />
                </IconButton>
              </HStack>
            </DialogHeader>
            <DialogBody>
              <Box height="250px" position="relative">
                <AnimatePresence initial={false} custom={1}>
                  {view === View.Pairs && (
                    <motion.div
                      key="selector"
                      custom={1}
                      variants={TRANSITION_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', width: '100%' }}
                    >
                      <Text textAlign="center">Create Pair Content</Text>
                    </motion.div>
                  )}

                  {view === View.Liquidity && (
                    <motion.div
                      key="addLiquidity"
                      custom={1}
                      variants={TRANSITION_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', width: '100%' }}
                    >
                      <Text textAlign="center">Add Liquidity Content</Text>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </Center>
    </Box>
  )
}
