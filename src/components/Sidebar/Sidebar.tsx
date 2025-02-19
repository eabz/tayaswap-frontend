'use client'

import { useBreakpoint } from '@/hooks'
import { useSidebar } from '@/state'
import {
  Box,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  HStack,
  IconButton,
  Stack,
  StackSeparator,
  Text,
  VStack
} from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ColorModeButton } from '../Buttons'
import {
  AnalyticsIcon,
  BridgeIcon,
  DashboardIcon,
  DiscordIcon,
  GitbookIcon,
  GithubIcon,
  HomeIcon,
  LinkIcon,
  PointsIcon,
  PoolsIcon,
  SwapIcon,
  XIcon
} from '../Icons'
import { CloseIcon } from '../Icons/Close'
import { Link } from '../Link'
import { SideBarLogo } from './Logo'

const MenuItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon h={6} /> },
  { name: 'Swap', path: '/swap', icon: <SwapIcon h={6} /> },
  { name: 'Pools', path: '/pools', icon: <PoolsIcon h={6} /> },
  { name: 'Bridge', path: '/bridge', icon: <BridgeIcon h={6} /> },
  { name: 'Points', path: '/points', icon: <PointsIcon h={6} /> },
  { name: 'Analytics', path: '/analytics', icon: <AnalyticsIcon h={6} /> }
]

interface IMenuItem {
  name: string
  path: string
  icon: ReactNode
  active: boolean
}

const MenuItem = ({ name, path, icon, active }: IMenuItem) => {
  return (
    <Link href={path}>
      <HStack
        py={3}
        px={5}
        width="full"
        spaceX={5}
        background={active ? 'blue' : 'none'}
        color={active ? 'white' : ''}
        rounded="full"
        _hover={{ background: 'blue', color: 'white' }}
      >
        {icon}
        <Text fontSize="md">{name}</Text>
      </HStack>
    </Link>
  )
}

export function Sidebar() {
  const { open, setOpen } = useSidebar()

  const pathname = usePathname()

  const { mobile } = useBreakpoint()

  return (
    <Box h="100vh" width="300px">
      <DrawerRoot open={mobile ? open : true} size="full" placement="start" modal={false}>
        <DrawerContent
          background="menu-bg"
          h="100vh"
          boxShadow="none"
          _open={{ animation: mobile ? undefined : 'none' }}
        >
          <DrawerHeader>
            <DrawerTitle justifyContent="center">
              <HStack justifyContent="center">
                <SideBarLogo />
                <Stack position="absolute" top="2" right="2" hideFrom="lg">
                  <IconButton onClick={() => setOpen(!open)} variant="ghost" size="xs" rounded="full">
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </HStack>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <VStack separator={<StackSeparator />}>
              {MenuItems.map((item, i) => (
                <MenuItem key={i} name={item.name} icon={item.icon} path={item.path} active={item.path === pathname} />
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter pb={10}>
            <VStack width="full" spaceY={4} separator={<StackSeparator />}>
              <Link href={'https://sublabs.xyz/'} external>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text>Powered By SubLabs</Text>
                  <LinkIcon h={4} />
                </HStack>
              </Link>
              <HStack justifyContent="space-between" width="full" px={5} borderTop={1} borderColor="#000">
                <Link href="/">
                  <HomeIcon h={5} />
                </Link>
                <Link href="https://x.com/sublabs_" external>
                  <XIcon h={5} />
                </Link>
                <Link href="#">
                  <DiscordIcon h={5} />
                </Link>
                <Link href="https://docs.taya.fi/" external>
                  <GitbookIcon h={5} />
                </Link>
                <Link href="https://github.com/sub-labs" external>
                  <GithubIcon h={5} />
                </Link>
              </HStack>
              <HStack justifyContent="space-between" width="full">
                <Text>v1.0.0</Text>
                <ColorModeButton />
              </HStack>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
