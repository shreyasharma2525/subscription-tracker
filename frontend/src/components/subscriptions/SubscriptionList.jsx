import { SimpleGrid, Text, Box } from "@chakra-ui/react";
import SubscriptionCard from "./SubscriptionCard";

function SubscriptionList({ subscriptions, onDelete, onEdit }) {
  if (subscriptions.length === 0) {
    return (
      <Box
        bg="white"
        p={8}
        borderRadius="2xl"
        textAlign="center"
        shadow="md"
        mt={8}
      >
        <Text color="gray.500">No subscriptions found.</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6} mt={8}>
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </SimpleGrid>
  );
}

export default SubscriptionList;