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
          :in => doc.css('InputEndpoint').collect { |x| create_hash(x) }.sort { |x, y| x[:name] <=> y[:name] },
          :out => doc.css('OutputEndpoint').collect { |x| create_hash(x) }
      }

      File.open(File.join(subdirectory, 'ENDPOINTS.md'), 'w') do |f|
        f.puts "# Notice\n\n"
        f.puts "This document has been generated automatically on #{Time.now}. If this file is not up to date, please (re-)run `rake doc_endpoints` from the command-line.\n\n"

        write_overview f, endpoints
        write_endpoints f, endpoints[:in], 'Input endpoints'
        write_endpoints f, endpoints[:out], 'Output endpoints'
      end
    end
  end
end

desc 'Create all zipped Wirecloud widget files'
task :all => [:doc_endpoints] do
  Dir.glob('**').each do |subdirectory|
    if File.exists?(File.join(subdirectory, '.bundle'))
      Rake::Task[:bundle].invoke subdirectory
      Rake::Task[:bundle].reenable
    end
  end
end

def create_hash(endpoint)
  {
      :name => endpoint[:name],
      :friendcode => endpoint[:friendcode],
      :description => endpoint[:description],
      :label => endpoint[:label],
      :documentation => endpoint.xpath('.//doc:Documentation/text()', {'doc' => 'crisma://documentation'}).collect { |x| x.text.strip.gsub(/\s{2,}/, '') }.shift
  }
end

def write_overview(f, endpoints)
  f.puts "# Overview\n\n"
  f.puts "**Declared inputs:** #{endpoints[:in].collect { |x| x[:name] }.join(', ')}\n\n"
  f.puts "**Declared outputs:** #{endpoints[:out].collect { |x| x[:name] }.join(', ')}\n\n"
end

def write_endpoints(f, endpoints, title)
  f.puts "# #{title}\n\n"

  if endpoints.empty?
    f.puts "(none)\n\n"
  else
    endpoints.each do |endpoint|
      f.puts "## #{endpoint[:label]}\n\n"
      f.puts "**Internal name:** `#{endpoint[:name]}`\n\n"
      f.puts "**Friendcode:** `#{endpoint[:friendcode]}`\n\n"
      f.puts "**Description:** #{endpoint[:description]}\n\n" if endpoint[:description]
      f.puts "#{endpoint[:documentation]}\n\n" if endpoint[:documentation]
    end
  end
end