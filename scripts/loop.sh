// TODO: remove

## declare an array variable
declare -a arr=(
  '3.35.0'
  '3.32.0'
  '3.29.0'
  '3.27.0'
  '3.24.0'
  '3.22.0'
  '3.19.0'
  '3.16.0'
  '3.13.0'
  '3.12.0'
  '3.10.0'
  '3.7.0'
  '3.3.0'
  '3.1.0'
  '3.0.0'
  '2.10.0'
  '2.8.0'
  '2.5.0'
  '2.2.0'
  '2.0.0'
  '1.22.0'
  '1.20.0'
  '1.17.0'
  'v1.16.0'
  'v1.15.0'
  'v1.14.0'
  'v1.13.0'
  'v1.11.0'
  'v1.12.0'
  'v1.10.0'
  'v1.9.0'
  'v1.7.0'
  'v1.6.0'
  'v1.5.0'
  'v1.4.0'
  'v1.3.0'
  'v1.2.0'
  'v1.1.0'
  'v1.0.0'
)

## loop through above array (quotes are important if your elements may contain spaces)
for i in "${arr[@]}"
do
   echo "installing $i..."
   fvm install -s $i

   echo "running $i..."
   npm run new $i

   echo "removing $i..."
   fvm remove $i
done

echo "completed!!"

# You can access them using echo "${arr[0]}", "${arr[1]}" also
