'use client'

import { useColorMode } from '@/hooks'
import {
  Box,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  HStack,
  StackSeparator,
  Text,
  VStack
} from '@chakra-ui/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { type ReactElement, useState } from 'react'
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
import { Link } from '../Link'

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
  icon: ReactElement
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
  const [open, setOpen] = useState(true)

  const pathname = usePathname()

  const { colorMode } = useColorMode()

  return (
    <Box h="100vh" width="300px">
      <DrawerRoot open={open} size="full" placement="start" modal={false}>
        <DrawerContent background="menu-bg" h="100vh" boxShadow="none">
          <DrawerHeader>
            <DrawerTitle justifyContent="center">
              <HStack justifyContent="center">
                <Image
                  src={colorMode === 'dark' ? '/logo-dark.svg' : '/logo-white.svg'}
                  width={100}
                  height={100}
                  alt="TayaSwap Interface"
                />
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
                <Text>v1.1.1</Text>
                <ColorModeButton />
              </HStack>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
