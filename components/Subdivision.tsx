import { Box, Spinner } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import TreeNode from './TreeGeo';

const Subdivision = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/subdivision")
        setData(response.data)
      } catch (error) {
        console.error("Erreur lors de la recuperation des donnees")
      } finally { setLoading(false) }
    }

    fetchData();
  }, [])

  if (loading) {
    return <Spinner />
  }
  return (
    <Box>
      {data.map((country: any) => (
        <TreeNode key={country.id_pays} node={country} />
      ))}
    </Box>
  )
}

export default Subdivision
