import {
    Box,
    Badge,
    Text,
    Heading,
    HStack,
    Button,
    VStack,
  } from "@chakra-ui/react";
  import { FiEdit, FiTrash2, FiCalendar, FiCreditCard } from "react-icons/fi";
  import BrandLogo from "./BrandLogo";
  import { useAppSettings } from "../../context/AppSettingsContext";
  
  function SubscriptionCard({ subscription, onDelete, onEdit }) {
    const {
      cardBg,
      textColor,
      mutedText,
      borderColor,
      softBg,
      formatCurrency,
    } = useAppSettings();
  
    return (
      <Box
        bg={cardBg}
        borderRadius="2xl"
        p={6}
        shadow="lg"
        border="1px solid"
        borderColor={borderColor}
        transition="0.25s ease"
        _hover={{
          transform: "translateY(-6px)",
          shadow: "2xl",
        }}
      >
        <HStack justify="space-between" align="start" mb={5}>
          <HStack align="center" gap={4}>
            <BrandLogo name={subscription.service_name} />
  
            <Box>
              <Heading size="md" color={textColor}>
                {subscription.service_name}
              </Heading>
  
              <Text color={mutedText} fontSize="sm">
                {subscription.owner_name}
              </Text>
            </Box>
          </HStack>
  
          <Badge
            colorPalette={subscription.is_active ? "green" : "red"}
            borderRadius="full"
            px={3}
            py={1}
          >
            {subscription.is_active ? "Active" : "Inactive"}
          </Badge>
        </HStack>
  
        <Box
          bg={softBg}
          borderRadius="xl"
          p={4}
          mb={5}
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack gap={2} color="purple.400" mb={1}>
            <FiCreditCard />
            <Text fontSize="sm" fontWeight="medium">
              Price Paid
            </Text>
          </HStack>
  
          <Heading size="lg" color="purple.400">
            {formatCurrency(subscription.cost)}
          </Heading>
  
          <Text color={mutedText} fontSize="sm">
            / {subscription.billing_cycle}
          </Text>
        </Box>
  
        <VStack align="stretch" gap={3} fontSize="sm">
          <HStack justify="space-between">
            <Text color={mutedText}>Category</Text>
            <Badge colorPalette="purple" borderRadius="full">
              {subscription.category}
            </Badge>
          </HStack>
  
          <HStack justify="space-between">
            <Text color={mutedText}>Last Paid</Text>
            <Text color={textColor} fontWeight="medium">
              {subscription.last_paid_date}
            </Text>
          </HStack>
  
          <HStack justify="space-between">
            <HStack color={mutedText}>
              <FiCalendar />
              <Text>Renewal</Text>
            </HStack>
  
            <Text color={textColor} fontWeight="medium">
              {subscription.next_renewal_date}
            </Text>
          </HStack>
        </VStack>
  
        {subscription.notes && (
          <Text mt={4} color={mutedText} fontSize="sm">
            {subscription.notes}
          </Text>
        )}
  
        <HStack mt={6} gap={3}>
          <Button
            flex="1"
            colorPalette="blue"
            variant="subtle"
            onClick={() => onEdit(subscription)}
          >
            <FiEdit />
            Edit
          </Button>
  
          <Button
            flex="1"
            colorPalette="red"
            variant="subtle"
            onClick={() => onDelete(subscription.id)}
          >
            <FiTrash2 />
            Delete
          </Button>
        </HStack>
      </Box>
    );
  }
  
  export default SubscriptionCard;