import { Box } from '@chakra-ui/react'


const TreeNode = ({ node }: any) => {
  return (
    <Box ml={4} borderLeft="1px solid #ccc" pl={2}>
      {node.libelle}
      {node.Departement && node.Departement.map((dept: any) => (
        <TreeNode
          key={dept.id_departement}
          node={dept}
        />
      ))}

      {node.Commune && node.Commune.map((com: any) => (
        <TreeNode
          key={com.id_commune}
          node={com}
        />
      ))}

      {node.SectionCommune && node.CommSectionCommune.map((section: any) => (
        <TreeNode
          key={section.id_sectioncommune}
          node={section}
        />
      ))}

      {node.Adresse && node.Adresse.map((adr: any) => (
        <TreeNode
          key={adr.id_adresses}
          node={adr}
        />
      ))}

    </Box>
  )
}

export default TreeNode
