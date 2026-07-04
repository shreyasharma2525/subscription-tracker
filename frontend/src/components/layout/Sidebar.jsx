import {
  Box,
  VStack,
  Text,
  Heading,
  HStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiCreditCard,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiZap,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useAppSettings } from "../../context/AppSettingsContext";

const menuItems = [
  {
    icon: FiGrid,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: FiCreditCard,
    label: "Subscriptions",
    path: "/subscriptions",
  },
  {
    icon: FiCalendar,
    label: "Renewals",
    path: "/renewals",
  },
  {
    icon: FiBarChart2,
    label: "Reports",
    path: "/analytics",
  },
  {
    icon: FiSettings,
    label: "Settings",
    path: "/settings",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { sidebarBg } = useAppSettings();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      w="290px"
      minH="100vh"
      bg={sidebarBg}
      color="white"
      px={6}
      py={7}
      position="sticky"
      top="0"
      boxShadow="2xl"
    >
      <HStack mb={10} gap={3}>
        <Box
          w="46px"
          h="46px"
          borderRadius="xl"
          bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="900"
          fontSize="xl"
          shadow="lg"
        >
          S
        </Box>

        <Box>
          <Heading size="md">SubTracker</Heading>
          <Text fontSize="xs" color="whiteAlpha.700">
            Smart subscription manager
          </Text>
        </Box>
      </HStack>

      <Box
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.200"
        p={4}
        borderRadius="2xl"
        mb={8}
        backdropFilter="blur(12px)"
      >
        <HStack justify="space-between">
          <Box>
            <Text fontWeight="bold">
              {`${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                user?.username ||
                "User"}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              {user?.email || "Logged in"}
            </Text>
          </Box>

          <Badge colorPalette="purple" borderRadius="full">
            Pro
          </Badge>
        </HStack>
      </Box>

      <VStack align="stretch" gap={2}>
        {menuItems.map((item) => {
          const MenuIcon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <HStack
                  px={4}
                  py={3}
                  borderRadius="xl"
                  gap={3}
                  cursor="pointer"
                  bg={isActive ? "white" : "transparent"}
                  color={isActive ? "#6D28D9" : "whiteAlpha.800"}
                  fontWeight={isActive ? "700" : "500"}
                  transition="0.25s ease"
                  _hover={{
                    bg: isActive ? "white" : "whiteAlpha.200",
                    color: isActive ? "#6D28D9" : "white",
                    transform: "translateX(4px)",
                  }}
                >
                  <Icon as={MenuIcon} boxSize={5} />
                  <Text>{item.label}</Text>
                </HStack>
              )}
            </NavLink>
          );
        })}
      </VStack>

      <Box
        mt={12}
        p={5}
        borderRadius="2xl"
        bg="linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.25))"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <HStack mb={3}>
          <Box
            w="38px"
            h="38px"
            borderRadius="lg"
            bg="whiteAlpha.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiZap />
          </Box>

          <Text fontWeight="bold">Track smarter</Text>
        </HStack>

        <Text fontSize="sm" color="whiteAlpha.800">
          Never miss your renewal dates. Manage everything in one place.
        </Text>
      </Box>

      <HStack
        mt={6}
        px={4}
        py={3}
        borderRadius="xl"
        gap={3}
        cursor="pointer"
        color="whiteAlpha.800"
        transition="0.25s ease"
        _hover={{
          bg: "whiteAlpha.200",
          color: "white",
          transform: "translateX(4px)",
        }}
        onClick={handleLogout}
      >
        <FiLogOut />
        <Text>Logout</Text>
      </HStack>
    </Box>
  );
}

export default Sidebar;
