require 'zip/zip'
require 'nokogiri'

desc 'Create zipped Wirecloud widget file for the specified project'
task :bundle, [:what] do |_, args|
  project = args[:what]
  archive = "#{project}.wgt"

  if project && Dir.exists?(project)
    File.delete(archive) if File.exists?(archive)
    puts "Bundling #{project} as #{archive}..."

    Zip::ZipFile.open(archive, Zip::ZipFile::CREATE) do |z|
      Dir[File.join(project, '**', '**')].each do |file|
        z.add(file.sub("#{project}/", ''), file) unless /[a-z]+\.md/i =~ file
      end
    end
  end
end

task :doc_endpoints do
  Dir.glob('**').each do |subdirectory|
    config_file = File.join(subdirectory, 'config.xml')
    if File.exists?(config_file)
      file = File.open config_file
      doc = Nokogiri::XML(file)
      file.close

      endpoints = {
          :in  => doc.css('InputEndpoint').collect { |x| create_hash(x) },
          :out => doc.css('OutputEndpoint').collect { |x| create_hash(x) }
      }

      File.open(File.join(subdirectory, 'ENDPOINTS.md'), 'w') do |f|
        f.puts '# Notice'
        f.puts "This document has been generated automatically on #{Time.now}. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line."
        f.puts ''

        write_endpoints!(f, endpoints[:in], 'Input endpoints')
        f.puts ''
        write_endpoints!(f, endpoints[:out], 'Output endpoints')
      end
    end
  end
end

desc 'Create all zipped Wirecloud widget files'
task :all => [:doc_endpoints] do
  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, '.bundle'))
      Rake::Task[:bundle].invoke(subdirectory)
      Rake::Task[:bundle].reenable
    end
  end
end

def create_hash(endpoint)
  {
      :name => endpoint[:name],
      :friendcode => endpoint[:friendcode],
      :description => endpoint[:description],
      :label => endpoint[:label]
  }
end

def write_endpoints!(f, endpoints, title)
  f.puts "# #{title}"

  if endpoints.empty?
    f.puts '(none)'
  else
    endpoints.sort! { |x, y| x[:name] <=> y[:name] }
    endpoints.each { |endpoint| f.puts "* **#{endpoint[:label]}**\n    * Internal name `#{endpoint[:name]}`, with declared friend-code: `#{endpoint[:friendcode]}`\n    * #{endpoint[:description]}" }
  end
end