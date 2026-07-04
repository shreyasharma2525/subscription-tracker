import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSettings } from "../../context/AppSettingsContext";

function AppLayout() {
  const { appBg, textColor } = useAppSettings();

  return (
    <Flex bg={appBg} color={textColor} minH="100vh">
      <Sidebar />

      <Box flex="1" p={8}>
        <Outlet />
      </Box>
    </Flex>
  );
}

export default AppLayout;