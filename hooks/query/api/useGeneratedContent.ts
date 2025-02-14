import React from 'react';

const useGenerateContent = () => {
  const [risk, setRisk] = React.useState<string | null>(null);
  const [protocolId, setProtocolId] = React.useState<string | null>(null);

  const setItemWithExpiry = (key: string, value: string) => {
    const item = {
      value: value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getItemWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (now - item.timestamp > tenMinutes) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  React.useEffect(() => {
    if (risk) {
      setItemWithExpiry("risk", JSON.stringify(risk));
    }
    
    if (protocolId) {
      setItemWithExpiry("protocolId", JSON.stringify(protocolId));
    }

    const cleanup = setInterval(() => {
      getItemWithExpiry("risk");
      getItemWithExpiry("protocolId");
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, [risk, protocolId]);

  return { risk, setRisk, protocolId, setProtocolId };
};

export default useGenerateContent;