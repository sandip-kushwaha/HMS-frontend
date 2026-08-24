
export const Header = ({title, value}) => {
  return (

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

          <p className="mt-1 text-lg text-gray-400">
            {value}
          </p>
        </div>
  )
}

export default Header;