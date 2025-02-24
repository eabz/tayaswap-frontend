'use client'

import type { IPairData } from '@/services'
import {
  Box,
  Button,
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
  Text,
  VStack
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronLeftIcon, CloseIcon } from '../Icons'

export interface IManagePoolModalProps {
  pool: IPairData
  open: boolean
  onClose: () => void
  close: () => void
}

enum View {
  Selector = 0,
  AddLiquidity = 1,
  RemoveLiquidity = 2
}

const VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0
  })
}

export function ManagePoolModal({ pool, open, onClose, close }: IManagePoolModalProps) {
  const [view, setView] = useState(View.Selector)
  const [direction, setDirection] = useState(0)

  const changeView = (newView: View) => {
    setDirection(newView > view ? 1 : -1)
    setView(newView)
  }

  return (
    <Box position="absolute" width={{ base: 'full', lg: 'calc(100vw - 600px)' }} px="5" height="100vh">
      <Center height="calc(100vh - 400px)">
        <DialogRoot open={open} size="xs" motionPreset="scale" onExitComplete={onClose}>
          <DialogBackdrop />
          <DialogContent rounded="25px" background="modal-background" border="1px solid" borderColor="modal-border">
            <DialogCloseTrigger />
            <DialogHeader>
              <HStack justifyContent="space-between">
                <HStack justifyContent="start" alignItems="center" gap="15px">
                  {(view === View.AddLiquidity || view === View.RemoveLiquidity) && (
                    <IconButton
                      onClick={() => changeView(View.Selector)}
                      variant="ghost"
                      size="xs"
                      rounded="full"
                      _hover={{ background: 'button-group-button-background' }}
                      background="modal-selector-button-background"
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                  )}
                  <DialogTitle>
                    <Text color="modal-title-color" fontWeight="400">
                      {view === View.Selector && 'Manage Pool'}
                      {view === View.AddLiquidity && 'Add Liquidity'}
                      {view === View.RemoveLiquidity && 'Remove Liquidity'}
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
              <Box height="250px" position="relative" overflow="hidden">
                <AnimatePresence initial={false} custom={direction}>
                  {view === View.Selector && (
                    <motion.div
                      key="selector"
                      custom={direction}
                      variants={VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', width: '100%' }}
                    >
                      <VStack height="225px" justifyContent="center" alignItems="center" gap="30px">
                        <Button
                          background="modal-selector-button-background"
                          color="button-group-button-active-color"
                          _hover={{ background: 'button-group-button-background' }}
                          onClick={() => changeView(View.AddLiquidity)}
                          rounded="15px"
                          width="300px"
                          height="90px"
                        >
                          <VStack width="full" alignItems="start">
                            <Text fontSize="18px" fontWeight="600">
                              Add Liquidity
                            </Text>
                            <Text fontWeight="300">Increase the amount of tokens in the pool.</Text>
                          </VStack>
                        </Button>
                        <Button
                          background="modal-selector-button-background"
                          color="button-group-button-active-color"
                          _hover={{ background: 'button-group-button-background' }}
                          onClick={() => changeView(View.RemoveLiquidity)}
                          width="300px"
                          rounded="15px"
                          height="90px"
                        >
                          <VStack width="full" alignItems="start">
                            <Text fontSize="18px" fontWeight="600">
                              Remove Liquidity
                            </Text>
                            <Text fontWeight="300">Reduce the amount of tokens in the pool.</Text>
                          </VStack>
                        </Button>
                      </VStack>
                    </motion.div>
                  )}

                  {view === View.AddLiquidity && (
                    <motion.div
                      key="addLiquidity"
                      custom={direction}
                      variants={VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', width: '100%' }}
                    >
                      <Text textAlign="center">Add Liquidity Content</Text>
                    </motion.div>
                  )}

                  {view === View.RemoveLiquidity && (
                    <motion.div
                      key="removeLiquidity"
                      custom={direction}
                      variants={VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      style={{ position: 'absolute', width: '100%' }}
                    >
                      <Text textAlign="center">Remove Liquidity Content</Text>
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
